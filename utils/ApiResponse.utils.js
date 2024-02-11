class ApiResponse {
    constructor(
        statuscode,
        data,
        message="Success"
    ){
        super(message);
        this.statuscode = statuscode;
        this.data = data;
        this.success = true;
    }
}

export {ApiResponse}