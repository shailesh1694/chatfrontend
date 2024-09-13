import { MessageInterface } from '@/interface/ChatInterface'
import dayjs from "dayjs"
import React from 'react'


const MessageList = ({ message, isOwanMessage }: { message: MessageInterface, isOwanMessage: boolean }) => {

    return (<div>
        <div className={`flex mt-5  ${isOwanMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${isOwanMessage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                <p>{message.message}</p>
                <p className="text-xs text-right mt-1 opacity-75">
                    {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                </p>
            </div>
        </div>
    </div>
    )
}

export default MessageList