import { Avatar, AvatarFallback } from './ui/avatar';
import { ChatInterface, ParticipantInterface } from '@/interface/ChatInterface';

const ParticipantList = (
  {
    participantList,
    onSelectParticipant,
    currentChatId,
    chat,
    unreactCount
  }
    :
    {
      participantList: ParticipantInterface,
      onSelectParticipant: (chat: ChatInterface, participant: ParticipantInterface) => void,
      currentChatId: string,
      chat: ChatInterface,
      unreactCount?: number
    }) => {

  return (
    <li
      className={`flex items-center p-4 hover:bg-gray-100 gap-2 cursor-pointer ${currentChatId === chat._id ? 'bg-gray-200' : ''}`}
      onClick={() => onSelectParticipant(chat, participantList)}
    >
      <Avatar className="h-9 w-9 sm:flex">
        {/* <AvatarImage src={contact.avatar} className="w-12 h-12 rounded-full mr-4" alt="Avatar" /> */}
        <AvatarFallback>{participantList.username.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">{participantList.username}</h3>
        <p className="text-sm text-gray-600 truncate">{participantList.mobile}</p>
      </div>
      {unreactCount as number > 0 && <Avatar>
        <AvatarFallback>{unreactCount}</AvatarFallback>
      </Avatar>}
    </li>
  )
}

export default ParticipantList