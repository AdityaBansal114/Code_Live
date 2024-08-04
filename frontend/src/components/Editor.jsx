import { useEffect, useRef, useState } from "react"
import ClientIcon from "./ClientIcon"
import CodeEditor from "./CodeEditorLive"
import CodeEditorLive from "./CodeEditorLive"
import { initSocket } from "../../socket"
import { useLocation, Navigate, useNavigate , useParams } from "react-router-dom"
import toast from "react-hot-toast"
import ACTIONS from '../../../Actions';

const Editor = () => {

    const socketRef= useRef(null);
    const syncCodeRef=useRef(null);
    const location= useLocation();
    const {roomId}= useParams();
    const [users, setUsers] = useState([])


    const reactNavigator=useNavigate();

    useEffect(()=>{
        const init= async()=>{
            socketRef.current= await initSocket();
            socketRef.current.on('connect_error',(err)=> handleErrors(err));
            socketRef.current.on('connect_failed',(err)=> handleErrors(err));

            function handleErrors(){
                console.log('socket error: ', e);
                toast.error('Connectection failed try later!');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username : location.state?.username,
            })

            // listening for joined event 
             socketRef.current.on(ACTIONS.JOINED, ({clients,username,socketId})=>{
                if(username!==location.state.username){
                    toast.success(`${username} joined the room`)
                } 
                setUsers(clients);

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: syncCodeRef.current,
                    socketId,
                })
             })



             // listening for disconnected clients

             socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                toast.success(`${username} left the room. `);
                setUsers((prev)=>{
                    return prev.filter(
                        (user)=> user.socketId!==socketId)
                })

             })
        

          
        }
        init();
        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);

        }
    },[])


    async function copyRoomId(){

        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard");
        } catch (error) {
            toast.error('Could not copy Room ID')
        }

    }

    function leaveRoom(){
        reactNavigator('/');
    }


    if(!location.state){
        return <Navigate to="/" />
    }




    return (
        <div className="flex">

            <div className="h-screen w-[250px] bg-gray-900 flex flex-col justify-between">

                <div className=" text-3xl text-white  text-center pt-5 bg-gray-900 ">
                    Code <span className="text-green-300 text-3xl"> Live</span>
                    <div className="divider"></div>
                    <div className="block text-xl text-left ml-7 text-gray-200 mb-5 ">
                        Connected Users
                    </div>


                    <div className="w-full">
                        {users.map((user) => (<ClientIcon username={user.username} key={user.socketId} />))}
                    </div>
                </div>


                <div className="mb-4">
                    <button className="btn btn-outline btn-accent w-full mt-6 mb-1"  onClick={copyRoomId}>Copy Room ID</button>
                    <button className="btn btn-outline btn-accent w-full mt-6 mt-1 " onClick={leaveRoom}>Leave</button>
                </div>

            </div>






            <div className="w-full h-screen">
            <CodeEditorLive socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { 
                syncCodeRef.current = code;
            }}/>
            </div>





        </div>
    )
}

export default Editor