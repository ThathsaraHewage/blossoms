import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react";

module.exports = function Home() {
    const { data: session } = useSession();
    if (!session) {
        return (
            <main>
                <div className="bg-blue-900 w-screen h-screen flex items-center">
                    <div className="text-center w-full">
                        <button onClick={() => signIn()} className="bg-white p-2 text-black px-4 rounded-lg">Login with Google</button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <div>logged in {session.user.email}</div>
    );
}
