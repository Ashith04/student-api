const http = require("http");

let students = [];

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

    res.setHeader("Content-Type", "application/json");

    // GET all students
    if (req.method === "GET" && req.url === "/students/") {

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: students
        }));
    }

    // GET student by ID
    else if (req.method === "GET" && req.url.startsWith("/students/")) {

        const id = req.url.split("/")[2];

        const student = students.find(s => s.id == id);

        if (!student) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                success: false,
                message: "Student not found"
            }));
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: student
        }));
    }

    // POST create student
    else if (req.method === "POST" && req.url === "/students") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const student = JSON.parse(body);

            student.id = students.length + 1;

            students.push(student);

            res.writeHead(201);
            res.end(JSON.stringify({
                success: true,
                message: "Student added",
                data: student
            }));
        });
    }

    // PUT update student
    else if (req.method === "PUT" && req.url.startsWith("/students/")) {
      console.log("PUT request received");

        const id = req.url.split("/")[2];

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const updatedData = JSON.parse(body);

            const index = students.findIndex(s => s.id == id);

            if (index === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({
                    success: false,
                    message: "Student not found"
                }));
            }

            students[index] = {
                ...students[index],
                ...updatedData
            };

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: "Student updated",
                data: students[index]
            }));
        });
    }

    // DELETE student
    else if (req.method === "DELETE" && req.url.startsWith("/students/")) {

        const id = req.url.split("/")[2];

        const index = students.findIndex(s => s.id == id);

        if (index === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                success: false,
                message: "Student not found"
            }));
        }

        students.splice(index, 1);

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: "Student deleted"
        }));
    }

    else {

        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: "Route not found"
        }));
    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});