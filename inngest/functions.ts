import { fetchAllNews, formatNewsSummary } from "@/lib/rss_utils";
import { inngest } from "./client";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

export const sendDailyNews = inngest.createFunction(
    { id: "send-daily-news" },
    // { event: "send.daily.news" },
    { cron: "34 9 * * *" },
    async ({ event, step }) => {
        const newsItems = await step.run("fetch-news", async () => {
            const news = await fetchAllNews()
            return news
        });
        const newsSummary = await step.run("format-news", async () => {
            const summary = formatNewsSummary(newsItems)
            return summary
        });
        const { data, error } = await step.run("create-email", async () => {
            const result = await resend.broadcasts.create({
                from: "Daily Briefs <onboarding@resend.dev>",
                segmentId: "d9e05414-2fae-466a-82b0-9891e38ef7c8",
                subject: "Daily News - " + new Date().toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                }),
                html: newsSummary.html,
            })
            return result
        })
        const { error: sendError } = await step.run("send-email", async () => {
            const result = await resend.broadcasts.send(data?.id!)
            return result
        })
        if (sendError) {
            return { error: sendError.message }
        }
        return { message: "email sent successfully" }
    },
);