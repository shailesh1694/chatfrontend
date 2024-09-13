import { z } from "zod"

export const signupValidation = z.object({
    emailOtp: z
        .number({ required_error: "Mobile Number is required", invalid_type_error: "Number must be a number", })
        .gt(1, { message: "At least 6 digit" })
        .lt(7, "Max 6 digit !")
        .positive({ message: "Number must be positive !" }),
})
