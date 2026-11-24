namespace InventorySystem_ASPNETCore.Common;

public class ServiceResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();

    public static ServiceResult Ok(string message = "Operación realizada correctamente.")
        => new() { Success = true, Message = message };

    public static ServiceResult Fail(string message, params string[] errors)
        => new() { Success = false, Message = message, Errors = errors.ToList() };
}

public class ServiceResult<T> : ServiceResult
{
    public T? Data { get; set; }

    public static ServiceResult<T> Ok(T data, string message = "Operación realizada correctamente.")
        => new() { Success = true, Message = message, Data = data };

    public static new ServiceResult<T> Fail(string message, params string[] errors)
        => new() { Success = false, Message = message, Errors = errors.ToList() };
}
