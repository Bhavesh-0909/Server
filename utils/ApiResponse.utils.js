class ApiResponse {
    constructor(
        statuscode,
        message="Success",
        data
    ){
        super(message);
        this.statuscode = statuscode;
        this.data = data;
        this.success = true;
    }
}

export {ApiResponse}