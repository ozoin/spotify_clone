import {useSession} from "next-auth/react";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import {shuffle} from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import {playlistIdState,playlistState} from '../atoms/playlistAtom'
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs"
const colors = [
    "from-red-500",
    "from-green-500",
    "from-indigo-500",
    "from-yellow-500",
    "from-purple-500",
    "from-pink-500",
    "from-brown-500",
];

function Center() {
    const {data:session} = useSession()
    const spotifyApi = useSpotify();
    const [color,setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist,setPlayList] = useRecoilState(playlistState)
    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])
    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data)=>{
            setPlayList(data.body)
        }).catch(err => console.log('some error'))
    }, [spotifyApi,playlistId])
    console.log(playlist);
    return (
        <div className=" flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 p-1 pr-2 rounded-full cursor-pointer ">
                    {
                        session?.user.image ? <img className="rounded-full w-10 h-10" src={session?.user.image} alt="user image"/> : <img className="rounded-full w-10 h-10" src="https://www.seekpng.com/png/full/356-3562377_personal-user.png" alt="user image"/>
                    }
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl px-3" src={playlist?.images?.[0]?.url} alt="playlist image"/>
                <div>
                    <p>PLAYLIST</p>
                    <h2 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h2>
                </div>
            </section>

            <div>
                <Songs/>
            </div>

        </div>
    )
}

export default Center
