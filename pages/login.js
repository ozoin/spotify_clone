import {getProviders,signIn} from "next-auth/react"
function Login({providers}) {
    console.log(providers)
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
            <img className="w-52 mb-5" src="https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-icon-green-logo-8.png" alt="login page spotify logo"/>

            {
                Object.values(providers).map((provider)=>(
                    <div key={provider.name}>
                        <button className="bg-[#18D860] text-white p-5 rounded-full transition transform hover:scale-105 duration:300" 
                        onClick={()=>signIn(provider.id,{callbackUrl:"/"})
                        }>Login with {provider.name}</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Login;

export async function getServerSideProps(){
    const providers = await getProviders();

    return {
        props:{
            providers
        }
    }

}