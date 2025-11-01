const express = require("express");
const app = express();
app.use(express.json());

const jobs = {}; // store job progress by jobId

// 🧩 POST /submit — client submits a job
app.post("/submit", (req, res) => {
    const jobId = `job_${Date.now()}`;
    jobs[jobId] = 0; // initial progress = 0

    // simulate async job update
    updateJob(jobId, 0);

    res.send({ jobId });
});

// 🧠 GET /status/:jobId — client polls for job status
app.get("/status/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const progress = jobs[jobId];

    if (progress === undefined) {
        return res.status(404).send({ error: "Job not found" });
    }

    // if job not finished yet
    if (progress < 100) {
        return res.send({ status: "processing", progress });
    } else {
        return res.send({ status: "done", progress: 100 });
    }
});

// 🔁 Helper — simulate background progress updates
function updateJob(jobId, progress) {
    const interval = setInterval(() => {
        if (jobs[jobId] >= 100) {
            clearInterval(interval);
        } else {
            jobs[jobId] += 20; // increase progress
            console.log(`${jobId}: ${jobs[jobId]}%`);
        }
    }, 2000); // every 2 seconds
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


/**
 * 
 * 
 * 
fragello@fragello:~/ME/Github/Full_Stack_Labs$ curl -X POST http://localhost:3000/submit
{"jobId":"job_1761927410043"}fragello@fragello:~/ME/Github/Full_Stack_Labs$ curl -X POST http://localhost:3000/submit
{"jobId":"job_1761927415184"}fragello@fragello:~/ME/Github/Full_Stack_Labs$ 
fragello@fragello:~/ME/Github/Full_Stack_Labs$ curl http://localhost:3000/status/job_1761927410043 
{"status":"done","progress":100} 
 * 
 * 
 */