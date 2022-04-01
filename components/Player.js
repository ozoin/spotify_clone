import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import {currentTrackIdState,isPlayingState} from '../atoms/songAtom'
import { useState, useEffect, useCallback } from "react";
import useSongInfo from '../hooks/useSongInfo'
import { SwitchHorizontalIcon, RewindIcon, PlayIcon, ReplyIcon, VolumeDownIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";
import { PauseIcon, FastForwardIcon } from "@heroicons/react/outline";
import {debounce} from 'lodash'
function Player() {
    const spotifyApi = useSpotify();
    const {data:session,status} = useSession();
    const [currentTrackId,setCurrentTrackIdState] = useRecoilState(currentTrackIdState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    const [volume,setVolume] = useState(50);
    const songInfo = useSongInfo();
    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackIdState(data.body?.item?.id);
            })
            spotifyApi.getMyCurrentPlaybackState().then(data => {
                setIsPlaying(data.body?.is_playing)
            })
        }
    }
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body?.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }
    const debouncedAdjustVolume = useCallback(
        debounce(volume => {
            spotifyApi.setVolume(volume).catch(err => {})
        },300),[]);
    
    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong()
            setVolume(50);
        }
    },[currentTrackId,spotifyApi,session])
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    },[volume])

    
    return (
        <div className="text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex item-center space-x-4 ">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} alt="song image player" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                )}
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button"/>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeOffIcon onClick={()=> volume > 0 && setVolume(volume-10)} className="button"/>
                <input type="range" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-10 md:w-28" min={0} max={100}/>
                <VolumeUpIcon onClick={()=> volume<100 && setVolume(volume+10)} className="button"/>
            </div>
        </div>
    )
}

export default Player
