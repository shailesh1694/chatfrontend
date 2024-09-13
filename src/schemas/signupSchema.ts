import { z } from "zod"

export const signupValidation = z.object({
    username: z.string({ required_error: "Username is required!" }).min(3, "Username contain at least 3 character!"),
    mobile: z
        .string({ required_error: "Mobile Number is required", invalid_type_error: "Number must be a number", })
        .min(10, { message: "At least 10 digit" })
        .max(10, "Max 10 digit !"),
    email: z
        .string({ required_error: "Email is required !" })
        .min(1, { message: "Email is required !" })
        .email({ message: "Enter valid email !" }),
    password: z.string({ required_error: "Password is required !" }).min(5, { message: "At least 5 !" }),
})

