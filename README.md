# BasicNestJS

# BasicProject NestJs

# Cấu trúc project:

- Khởi tạo project sẽ có các thành phần chính sau đây:
 + main.ts: Sử dụng NestFactory để khởi tạo ứng dụng.
 + app.controller.ts: Chứa các router để xử lý các request và trả về response cho client.
 + app.controller.spec.ts: Có nhiệm vụ viết unit-test cho các controller.
 + app.module.ts: Root module của ứng dụng.
 + app.service.ts: Service chứa các logic mà controller sẽ dùng đến.

- Helpers: Lưu trữ những file config, hoặc những file có thể dùng chung cho hệ thống
 + Database config
 + App config ( PORT, HOST, ... )
 
- Module: Các Module của ứng dụng ( bao gôm provider, controller, import, export )
 + Module có nhiệm vụ đóng gói những logic liên quan của các chức năng cần triển khai đến client một cách độc lập.
 + Một module trong Nest là class được define với @Module (). 
 + @Module() sẽ cung cấp metadata mà Nest sử dụng để tổ chức cấu trúc ứng dụng
 + Trong một module sẽ bao gồm các thành phần chính sau đây:
  . providers: Có nhiệm vụ khởi tạo và cung cấp các service mà sẽ được controller trong module sẽ sử dụng đến.
  . controllers: Có nhiệm vụ khởi tạo những controller đã được xác định trong module.
  . imports: Có nhiệm vụ import những thành phần của một module khác mà module sẽ sử dụng.
  . exports: Có nhiệm vụ export các thành phần của provider và các module khác sẻ import để sử dụng.
  
- Controller:
 + Lưu trữ file xử lí logic ( query database, handle logic ...) chứa các router để xử lý các request và trả về response cho client.
 + Để tạo ra một controller chúng ta sử dụng một class và @Controller().
 + @Controller() sẽ có nhiệm vụ liên kết class Controller đó với request tương ứng

- Spec: Có nhiệm vụ viết unit-test cho các controller.

- Service: 
 + Service chứa các logic mà controller sẽ dùng đến ( Chứa Provider: nơi cung cấp các servce, repositories, factories, helpers,... cho controller trong một module sử dụng )
 
- DTO (Data Transfer Object): 
 + Chặn những dữ liệu không hợp lệ trước khi thực hiện xử lý...
 
- Models: 
 + Các entity được lưu trữ thành một model

- Middleware:
 + Chứa các file xử lí error, validate ...
 + Thực thi bất kỳ đoạn code nào.
 + Thực hiện các thay đổi đối với request và response object.
 + Kết thúc chu kỳ request-response.
 + Gọi hàm middleware tiếp theo trong ngăn xếp.
 + Nếu hàm middleware hiện tại không kết thúc chu kỳ request-response, nó phải gọi next() để chuyển quyền điều khiển cho hàm middleware tiếp theo. Nếu không, request sẽ bị treo.

- Interceptor:
 + Ràng buộc logic bổ sung trước / sau khi thực thi phương thức
 + Biến đổi kết quả trả về từ một hàm
 + Biến đổi exception được ném ra từ một hàm
 + Mở rộng hành vi function cơ bản
 + Override hoàn toàn một function tùy thuộc vào các điều kiện cụ thể

- Guards:
 + Guards có quyền truy cập vào instance ExecutionContext và do đó biết chính xác những gì sẽ được thực thi tiếp theo.
 + Chúng được thiết kế, giống như exception filters, pipes và interceptors, để cho phép bạn sử dụng logic xử lý chính xác vào đúng điểm trong chu kỳ request/response

- Exception filters: 
 + Nest cung cấp một thành phần xử lý các trường hợp ngoại lệ mà ứng dụng của bạn chưa xử lý
 + Khi một ngoại lệ xảy ra, nếu ứng dụng của bạn không xử lý Exception filters sẽ xử lý ngoại lệ đó và trả về response cho người dùng
 + Nest cung cấp class HttpException để gửi các response http tiêu chuẩn khi có lỗi xảy ra.
 + Ngoài ra, bạn có thể tạo ra các bộ lọc riêng cho ứng dụng của mình bằng cách kế thừa HttpException.
 
# Author

Manh Luong
