import fetch from "node-fetch";

export const getDayliFile = ():string => {
    let dateOne = new Date();
    let secondDay = format(dateOne);
    dateOne.setDate(dateOne.getDate()-1);
    let firstDay = format(dateOne);
    let dayliFileString = "https://torgi.gov.ru/new/opendata/7710568760-notice/data-"+
        firstDay+
        "T0000-"+
        secondDay+
        "T0000-structure-20240401.json";
    return dayliFileString;
}

//download json file by url
export async function getData(url: fetch.RequestInfo) {
    try {
        const response = await fetch(url);
        return response.json();
    }
    catch (error){
        let rn = Math.random();
        setTimeout(()=>{getData(url)},rn*10000);
        console.log(error);
        console.log(new Date());
    }
}

// formatDate
function format(inputDate: Date) {
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');

    return `${year}${month}${date}`;
}