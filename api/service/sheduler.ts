import {downloadOpenData} from "./downloader";


const reloadTimer = 86400000 //1 day;

export const startSheduler = () =>{
    setInterval(downloadOpenData,reloadTimer);
}