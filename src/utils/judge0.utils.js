import axios from "axios";

export const getJudge0LanguageId = async function(language){
    const languageId = {
        "JEVESCRIPT": 63,
        "PYTHON": 71,
        "TYPESCRIPT": 74,
        "C (GCC 9.2.0)": 50,
    }

    return languageId[language.toUpperCase()] || 0;
}

export const submitBatch = async function(submissions) {
    const {data} = await axios.post(`${process.env.JUDGE_API}/submissions/batch?base64_encoded=false`, {
        submissions
    })

    console.log("Judge0 response: ", data);

    return data;
}

// cooling method used to retrive data from judge0 api
const sleep = (ms)=> new Promise(resolve=>setTimeout(resolve, ms));

export const poolBatchToken = async function(tokens){
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE_API}/submissions/batch`, {
            params:{
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every((result)=>{
            return result.status.id !== 1 && result.status.id !== 2
        })

        if(isAllDone){
            return results;
        }

        await sleep(1000)

    }
}