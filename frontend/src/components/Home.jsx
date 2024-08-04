import { useState } from 'react';
import {v4 } from 'uuid';
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const Home = () => {

    const [roomId, setRoomId]= useState("");
    const [username, setUsername]=useState("");
    const navigate = useNavigate();


    const createNewRoom= (e)=>{
        e.preventDefault();
        const n_id= v4();
        setRoomId(n_id);
        toast.success("New room ID generated, Enter your name")
    };

    const joinRoom = (e)=>{
        e.preventDefault();

        if(!roomId || !username){
            toast.error("Please Fill Room ID and Name")
            return;
        }
        const url= `/editor/${roomId}`;
        console.log(url);

        navigate(url, { state: { username } });

    }

    return (
        <div className='h-full flex items-center justify-center'>

            <div className="rounded-lg bg-transparent w-full max-w-[400px] flex flex-col bg-slate-700 p-7 shadow-lg    ">

                <div className="p-4 w-full text-center"> 
                    <h1 className="text-3xl text-white font-semibold">Live 
                        <span className="text-green-300">  {" "} Code_Editor</span>
                    </h1>
                </div>

            <form >

                <label className="label"> Invitation Room ID</label>
                <input type="text" placeholder="Enter Room ID "className=" input input-bordered input-accent w-full"
                value={roomId} 
                onChange={(e)=>setRoomId(e.target.value)}
                />

                <label className=" label mt-2"> Name</label>
                <input type="text" placeholder="Enter your Name "className=" input input-bordered input-accent w-full"
                value={username} 
                onChange={(e)=>setUsername(e.target.value)}
                
                />

                <button className="btn btn-outline btn-accent w-full mt-6 text- " onClick={joinRoom}>Join</button>

                <p className="text-sm mt-3">if you do not have have an invite then <a href="" className="underline hover:text-green-200" onClick={createNewRoom}>Create Room</a></p>
                   
            </form>

            </div>
               





        </div>
    )
}

export default Home