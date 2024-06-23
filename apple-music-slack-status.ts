#!/usr/bin/env deno run --allow-env --allow-run --allow-net --allow-read --allow-write --unstable-ffi --allow-ffi
import { run } from "https://deno.land/x/jxa_run@v0.0.3/mod.ts";
import type {} from "https://deno.land/x/jxa_run@v0.0.3/global.d.ts";
import type { iTunes } from "https://deno.land/x/jxa_run@v0.0.3/types/system-apps/ITunes.d.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts"

const slackToken = Deno.env.get('SLACK_TOKEN')
if (!slackToken) {
    console.error(`${Date.now()} - No slack API token!`)
    await run(() => {
        const app = Application.currentApplication()

        //@ts-ignore: this works
        app.includeStandardAdditions = true 
    
        app.displayNotification("No slack api token!", {
            withTitle: "apple-music-slack-status",
            subtitle: "Add one using the install script."
        })

    })
    Deno.exit(1)
}
const slack = SlackAPI(Deno.env.get('SLACK_TOKEN') as string)


// helper functions

const SLEEP_TIME = 15000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function playerState(): Promise<string> {
    return await run(() => {
        const music = Application("Music") as unknown as iTunes
        return music.playerState() 
    })
}

async function getCurrentTrack() {
    return await run(() => {
        const music = Application("Music") as unknown as iTunes
        return {
            name: music.currentTrack().name(),
            artist: music.currentTrack().artist(),
            duration: music.currentTrack().duration(),
            playerPosition: music.playerPosition()
        }
    })
}

async function isOpen(): Promise<boolean> {
    return await run(() => {
        return Application("System Events").processes['Music'].exists()
    })
}

async function main() {
    // TODO: use a file for config key
    while (true) {
        const open = await isOpen()
        if (!open) {
            const currentProfile = await slack.users.profile.get()
            if (currentProfile.profile.status_emoji == ":applemusic:") {
                await slack.users.profile.set({
                    profile: {
                        status_text: "",
                        status_emoji: ""
                    }
                })
            }
            await sleep(SLEEP_TIME)
            continue
        }
        const state = await playerState()
        if (state == 'playing') {
            const currentTrack = await getCurrentTrack()
            await slack.users.profile.set({
                profile: {
                    status_text: `listening to ${currentTrack.name} by ${currentTrack.artist}`,
                    status_emoji: ":applemusic:",
                    status_expiration: 0
                }
            })
            await sleep(SLEEP_TIME)
            continue
        }
        if (state == 'paused' || state == 'stopped') {
            const currentProfile = await slack.users.profile.get()
            if (currentProfile.profile.status_emoji == ":applemusic:") {
                await slack.users.profile.set({
                    profile: {
                        status_text: "",
                        status_emoji: ""
                    }
                })
            }
            await sleep(SLEEP_TIME)
            continue
        }
    }
}

await main()