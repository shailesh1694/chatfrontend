import { ApiSuccessResponse } from "@/interface/apiResponse"
import  {  AxiosResponse } from "axios"


export const requestApiHandler = async (
    api: () => Promise<AxiosResponse<ApiSuccessResponse, any>>,
    setLoading: ((data: boolean) => void) | null,
    onSuccess: (data: ApiSuccessResponse) => void,
    onError: (error: { message: string, success: boolean }) => void
) => {
    setLoading && setLoading(true)
    try {
        const response = await api();
        const { data } = response;
        if (data?.success) {
            onSuccess(data)
        }
    } catch (error: any) {
        onError(error.response?.data)
    } finally {
        setLoading && setLoading(false)
    }

}