import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function DashboardPage(){

    const session = await auth();

    console.log(session?.user)

    if(!session?.user){
        redirect('/');
    }

    return <div>hello dashboard</div>



}