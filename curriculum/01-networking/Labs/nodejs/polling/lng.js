const express = require("express");
const app = express();
app.use(express.json());

const jobs = {}; // store job progress by jobId
const waitingClients = {}; // store pending responses per jobId

// 🧩 POST /submit — client submits a job
app.post("/submit", (req, res) => {
    const jobId = `job_${Date.now()}`;
    jobs[jobId] = 0; // initial progress = 0

    // simulate async job update
    updateJob(jobId);

    res.send({ jobId });
});

// 🧠 GET /status/:jobId — client long polls for job status
app.get("/status/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const progress = jobs[jobId];

    if (progress === undefined) {
        return res.status(404).send({ error: "Job not found" });
    }

    // if job is done → respond immediately
    if (progress >= 100) {
        return res.send({ status: "done", progress: 100 });
    }

    // otherwise, store this client response to reply later
    if (!waitingClients[jobId]) waitingClients[jobId] = [];
    waitingClients[jobId].push(res);

    // optional timeout (to avoid hanging forever)
    setTimeout(() => {
        // If still not done after 25 sec → respond with current progress
        if (jobs[jobId] < 100) {
            res.send({ status: "processing", progress: jobs[jobId] });
            // remove it from waiting clients
            waitingClients[jobId] = waitingClients[jobId].filter(r => r !== res);
        }
    }, 25000); // 25 seconds timeout
});

// 🔁 Helper — simulate background progress updates
function updateJob(jobId) {
    const interval = setInterval(() => {
        if (jobs[jobId] >= 100) {
            clearInterval(interval);
            notifyClients(jobId);
        } else {
            jobs[jobId] += 20;
            console.log(`${jobId}: ${jobs[jobId]}%`);
            notifyClients(jobId); // notify waiting clients
        }
    }, 5000); // every 5 seconds
}

// 📬 Notify waiting clients when job progresses
function notifyClients(jobId) {
    if (waitingClients[jobId]) {
        waitingClients[jobId].forEach(res => {
            res.send({ status: jobs[jobId] >= 100 ? "done" : "processing", progress: jobs[jobId] });
        });
        waitingClients[jobId] = []; // clear after responding
    }
}

app.listen(3000, () => {
    console.log("🚀 Long-polling server running on port 3000");
});
