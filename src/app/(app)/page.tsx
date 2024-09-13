"use client"
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ChatEvent } from '@/interface/ChatEventEnum';
import { Button } from '@/components/ui/button';
import { Circle, CircleUser, CornerDownLeft, GripVertical, Loader2, MessageSquareMore, MessageSquarePlus, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { socket } from "@/socket";
import { ChatInterface, MessageInterface, ParticipantInterface } from '@/interface/ChatInterface';
import { requestApiHandler } from '@/helper/requestApiHandler';
import { error } from 'console';
import { useToast } from '@/hooks/use-toast';
import { ErrorType } from '@/interface/ErrorType';
import { getAllChats, getAllMessage, getAuth, sendMessage, signOutUser } from '@/helper/axiosInstance';
import ParticipantList from '@/components/ParticipantList';
import MessageList from '@/components/MessageList';
import { useRouter } from 'next/navigation';

const DashBoard = () => {

    const [inputMessage, setInputMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');


    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [chats, setChats] = useState<ChatInterface[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isChatLoading, setIsChatLoading] = useState<boolean>(false)
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantInterface>()

    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState<MessageInterface[]>([])
    const [unreadMessage, setUnreadMessage] = useState<MessageInterface[]>([])

    const [isSelfTyping, setIsSelfTyping] = useState<boolean>(false)
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const currentChatRef = useRef<ChatInterface>()
    const loginUser = useRef<ParticipantInterface>()
    const typingTimeRef = useRef<ReturnType<typeof setTimeout>>()

    const { toast } = useToast()

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);


    useEffect(() => {
        requestApiHandler(
            async () => await getAuth(),
            setIsLoading,
            (res) => {
                const { data } = res;
                loginUser.current = data;
            },
            (error: ErrorType) => {
                toast({ title: "Error", description: error.message, variant: "destructive" })
            }
        )

        requestApiHandler(
            async () => await getAllChats(),
            setIsChatLoading,
            (res) => {
                const { data } = res;
                setChats(data);
            },
            (error: ErrorType) => {
                toast({ title: "Error", description: error.message, variant: "destructive" })
            }
        )

    }, [])

    useEffect(() => {
        if (socket.connected) {
            onConnect()
        }
        socket.on(ChatEvent.CONNECTED_EVENT, onConnect);
        socket.on(ChatEvent.DISCONNECT_EVENT, onDisconnect);
        socket.on(ChatEvent.NEW_CHAT_EVENT, onAddNewChat);
        socket.on(ChatEvent.LEAVE_CHAT_EVENT, onChatLeave);
        socket.on(ChatEvent.TYPING_EVENT, OnTyping);
        socket.on(ChatEvent.STOP_TYPING_EVENT, OnStopTyping);
        socket.on(ChatEvent.RECIVED_MESSAGE_EVENT, onReceivedMessage);

        return () => {
            socket.off(ChatEvent.CONNECTED_EVENT, onConnect);
            socket.off(ChatEvent.DISCONNECT_EVENT, onDisconnect);
            socket.off(ChatEvent.NEW_CHAT_EVENT, onAddNewChat);
            socket.off(ChatEvent.LEAVE_CHAT_EVENT, onChatLeave);
            socket.off(ChatEvent.TYPING_EVENT, OnTyping);
            socket.off(ChatEvent.STOP_TYPING_EVENT, OnStopTyping);
            socket.off(ChatEvent.RECIVED_MESSAGE_EVENT, onReceivedMessage);
        }
    }, [socket])


    function onConnect() {
        setIsConnected(true)
    }

    function onDisconnect() {
        setIsConnected(false)
    }

    function onAddNewChat(chat: ChatInterface) {
        setChats((pre) => [...pre, chat])
    }

    function onChatLeave(chat: ChatInterface) {
    }

    function OnTyping(chatId: string) {
        if (currentChatRef.current?._id !== chatId) return;
        setIsTyping(true)
    }

    function OnStopTyping(chatId: string) {
        if (currentChatRef.current?._id !== chatId) return;
        setIsTyping(false)
    }

    function onReceivedMessage(message: MessageInterface) {
        if (currentChatRef.current?._id === message.chat) {
            setMessages((pre) => [message,...pre])
        } else {
            setUnreadMessage((pre) => [...pre, message])
        }
    }

    function onSelectParticipant(chat: ChatInterface, participant: ParticipantInterface) {

        currentChatRef.current = chat;
        socket.emit(ChatEvent.JOIN_CHAT_EVENT, chat._id)
        setSelectedParticipant(participant)
        setUnreadMessage((pre) => pre.filter((message) => message.chat !== chat._id))
        //  for show meessages in current chat
        requestApiHandler(
            async () => await getAllMessage(chat._id),
            setIsMessageLoading,
            (res) => {
                const { data } = res;
                console.log((data), "data in message")
                setMessages(data);
            },
            (error: ErrorType) => {
                toast({ title: "Error", description: error.message, variant: "destructive" })
            })
    }



    function onChangeMessageInput(e: ChangeEvent<HTMLTextAreaElement>) {
        setInputMessage(e.target.value)
        if (!isConnected) return;
        if (!isSelfTyping) {
            setIsSelfTyping(true)
            socket.emit(ChatEvent.TYPING_EVENT, currentChatRef.current?._id)
        }

        if (typingTimeRef.current) {
            clearTimeout(typingTimeRef.current)
        }

        typingTimeRef.current = setTimeout(() => {
            socket.emit(ChatEvent.STOP_TYPING_EVENT, currentChatRef.current?._id)
        }, 3000);

        setIsSelfTyping(false)
    }


    function handleSendMessage() {
        if (!inputMessage) return;
        requestApiHandler(
            async () => await sendMessage(currentChatRef.current?._id as string, inputMessage),
            null,
            (res) => {
                const { data } = res;
                setInputMessage("") // clear input message
                setMessages((pre) => [data, ...pre])
            },
            (error: ErrorType) => {
                toast({ title: "Error in Sending Message", description: error.message, variant: "destructive" })
            }
        )
    }


    return (
        <div className="flex h-screen max-md:flex-col max-md:gap-5 flex-row bg-gray-100">
            {/* Sidebar */}
            <div className="max-md:w-full w-1/4 bg-white border-r border-gray-300 overflow-y-auto">
                <div className=" flex justify-between p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search contacts"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <Button variant="secondary" size="icon">
                        <MessageSquarePlus className="h-4 w-4" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                requestApiHandler(
                                    async () => await signOutUser(),
                                    null,
                                    (res) => {
                                        router.replace('/sign-in')
                                    },
                                    (error: ErrorType) => {
                                        toast({ title: "Error in Signout user", description: error.message, variant: "destructive" })
                                    }
                                )
                            }}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {isChatLoading
                    ? <div className='h-1/2 flex items-center justify-center'>
                        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                    </div>
                    : <ul>
                        {
                            chats.map((items) =>
                                <ParticipantList
                                    key={items._id}
                                    chat={items}
                                    participantList={items.participants.find((participant) => participant._id !== loginUser.current?._id) as ParticipantInterface}
                                    onSelectParticipant={onSelectParticipant}
                                    currentChatId={currentChatRef.current?._id || ""}
                                    unreactCount={unreadMessage.filter((unread) => unread.chat === items._id).length}
                                />
                            )}
                    </ul>}
            </div>

            {/* Main Chat Section */}
            {
                selectedParticipant
                    ? <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-300 p-4 flex justify-between">
                            <div className='flex items-center'>
                                <Avatar className="w-10 h-10 rounded-full mr-4">
                                    <AvatarFallback>{selectedParticipant.username.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-semibold">{selectedParticipant.username}</h2>
                                    <p className="text-sm text-gray-600">
                                        {/* {selectedParticipant. ? 'Online' : 'Offline'} */}
                                        {isTyping ? 'Typing...' : selectedParticipant.mobile}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon">
                                        <GripVertical className="h-4 w-4" />
                                        <span className="sr-only">Toggle user menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Info</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Delete Chat</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 flex flex-col-reverse overflow-y-auto p-4"
                        >
                            {
                                messages.map((message) => (
                                    <MessageList
                                        key={message._id}
                                        message={message}
                                        isOwanMessage={message.sender._id === loginUser.current?._id}
                                    />
                                ))
                            }
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-300 p-4">
                            <div className="flex items-center space-x-2">
                                <textarea
                                    value={inputMessage}
                                    onChange={onChangeMessageInput}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <CornerDownLeft />
                                </button>
                            </div>
                        </div>
                    </div>
                    : <div className="flex-1 flex flex-col">
                        <div className='h-1/2 flex flex-col items-center justify-center'>
                            <MessageSquareMore size={100} className='text-green-500' />
                            <h4 className='font-semibold'>Start Chatting !</h4>
                        </div>
                    </div>
            }
        </div>
    )
}

export default DashBoard