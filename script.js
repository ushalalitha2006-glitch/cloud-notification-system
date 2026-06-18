const SUPABASE_URL =
"https://bpyxxrihbgevpwtnyqbv.supabase.co";

const SUPABASE_KEY =
"sb_publishable_XJfWpcdH4EupuZPw1mY3lA_1M2xRiec";

const client =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

emailjs.init(
    "EDmhVfv_cN5tj9W9Y"
);

async function sendNotification() {

    const email =
    document.getElementById("email").value.trim();

    const message =
    document.getElementById("message").value.trim();

    if (!email || !message) {

        alert(
            "Please enter both email and message."
        );

        return;
    }

    // SAVE NOTIFICATION

    const { data, error } =
    await client
    .from("notifications")
    .insert([
        {
            email: email,
            message: message,
            status: "PENDING"
        }
    ])
    .select();

    if (error) {

        alert(error.message);

        return;
    }

    const notificationId =
    data[0].id;

    try {

        console.log(
            "Sending email to:",
            email
        );
        alert("Sending to: " + email);
        await emailjs.send(

            "service_14oof04",

            "template_510vigr",

            {
                to_email: email,
                message: message
            }

        );

        await client
        .from("notifications")
        .update({
            status: "SENT"
        })
        .eq(
            "id",
            notificationId
        );

        alert(
            "Notification Sent Successfully"
        );

        document.getElementById(
            "email"
        ).value = "";

        document.getElementById(
            "message"
        ).value = "";

    } catch (err) {

        console.error(err);

        await client
        .from("notifications")
        .update({
            status: "FAILED"
        })
        .eq(
            "id",
            notificationId
        );

        alert(
            "Email sending failed"
        );
    }
}