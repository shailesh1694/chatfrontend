import { z } from "zod"

export const codeVerifySchema = z.object({
    otp: z
        .string({ required_error: "code is required"})
        .min(6, { message: "At least 6 digit" })
        .max(6, "Max 6 digit !"),
})