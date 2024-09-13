import { z } from "zod"

export const signinValidation = z.object({
    mobile: z
        .string({ required_error: "Mobile Number is required", invalid_type_error: "Number must be a number", })
        .min(10, { message: "At least 10 digit" })
        .max(10, "Max 10 digit !"),
    password: z.string({ required_error: "Password is required !" }).min(5, { message: "At least 5 !" }),
})