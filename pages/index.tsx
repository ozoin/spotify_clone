import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import { getSession } from 'next-auth/react'
import Player from '../components/Player'
const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/icons8-spotify.svg" />
        <style data-href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"/>
      </Head>
      <main className="flex ">
        <Sidebar />
        <Center/>
      </main>
      <div className="sticky bottom-0">
        <Player/>
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }
}