const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
let smsController = {
    sendSMS: async (req, res) => {
        try {
            // Construct data
            const OTP = generateOTP();
            const apiKey = "apikey=" + encodeURIComponent(process.env.SMSAPIKEY);
            const message = "&message=" + encodeURIComponent(`Dear Customer, ${OTP} is Your (One Time Password)OTP to validate your login. Do not share it with anyone`);
            const sender = "&sender=" + encodeURIComponent("KONETE");
            const numbers = "&numbers=" + encodeURIComponent(req.body.number);
            console.log(req.body);

            // Send data
            const data = "https://api.textlocal.in/send/?" + apiKey + numbers + message + sender;
            const response = await fetch(data);
            const responseData = await response.json();
            console.log(responseData.status);

            if (responseData.status === "success") {
                res.json({ status: "success", res: Buffer.from(OTP, 'base64').toString('binary') });
            } else {
                res.json({ status: "failed" });
            }
        } catch (error) {
            console.error("Error SMS", error);
            res.status(500).json({ status: "error", error: "Internal Server Error" });
        }
    }
}

module.exports = smsController;