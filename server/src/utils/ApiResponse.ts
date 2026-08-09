class ApiResponse<T> {
    public success: boolean;
    public statusCode: number;
    public message: string;
    public data: T | null;
  
    constructor(
      statusCode: number,
      data: T | null = null,
      message = "Success"
    ) {
      this.success = statusCode >= 200 && statusCode < 400;
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
    }
  }
  
  export default ApiResponse;