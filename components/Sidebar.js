import {HomeIcon,LibraryIcon,SearchIcon, HeartIcon, RssIcon, PlusCircleIcon, LogoutIcon} from '@heroicons/react/outline'
import {signOut, useSession} from "next-auth/react"
import { useState, useEffect } from 'react';
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from 'recoil';
import {playlistIdState} from '../atoms/playlistAtom';
function Sidebar() {
    const {data:session,status} = useSession();
    const [playlists,setPlayLists] = useState([]);    
    const [playlistId,setPlaylistId] = useRecoilState(playlistIdState);
    console.log(session)
    const spotifyApi = useSpotify();
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data)=>{
                setPlayLists(data.body.items)
            });
        }
    },[session,spotifyApi])

    const buttons = [
        {
            name:"Home",
            icon:<HomeIcon className="h-5 w-5"/>,
        },
        {
            name:"Search",
            icon:<SearchIcon className="h-5 w-5"/>,
        },
        {
            name:"Your Library",
            icon:<LibraryIcon className="h-5 w-5"/>,
        },
    ]
    const buttons2 = [
        {
            name:"Create Playlist",
            icon:<PlusCircleIcon className="h-5 w-5"/>,
        },
        {
            name:"Your Episodes",
            icon:<RssIcon className="h-5 w-5"/>,
        },
        {
            name:"Liked Songs",
            icon:<HeartIcon className="h-5 w-5"/>,
        },
    ]
    return (
        <div className="text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
            <div className="space-y-4">
                    <button className="flex items-center space-x-2 hover:text-white" onClick={()=>signOut()}>
                        <LogoutIcon className="h-5 w-5"/>
                        <p>Logout</p>
                    </button>
                {
                    buttons.map((button) => (
                        <button className="flex items-center space-x-2 hover:text-white">
                            {button.icon}
                            <p>{button.name}</p>
                        </button>
                    ))
                }
                <hr className="border-t-[0.1px] border-gray-900"/>
                {
                    buttons2.map((button) => (
                        <button className="flex items-center space-x-2 hover:text-white">
                            {button.icon}
                            <p>{button.name}</p>
                        </button>
                    ))
                }
                <hr className="border-t-[0.1px] border-gray-900"/>

                {
                    playlists.map((playlist) => (
                        <p key={playlist.id} onClick={()=>setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">{playlist.name}</p>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar
