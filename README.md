# BasicNestJS

BasicProject NestJs

Cấu trúc project:

Main.ts: Sử dụng NestFactory để khởi tạo ứng dụng.
Helpers : Lưu trữ những file config, hoặc những file có thể dùng chung cho hệ thống
Controller: Lưu trữ file xử lí logic ( query database, handle logic ...) chứa các router để xử lý các request và trả về response cho client.
Spec: Có nhiệm vụ viết unit-test cho các controller.
Module: Các Module của ứng dụng ( bao gôm provider, controller, import, export )
Service: Service chứa các logic mà controller sẽ dùng đến ( Chứa Provider: nơi cung cấp các servce, repositories, factories, helpers,... cho controller trong một module sử dụng )
DTO (Data Transfer Object): Chặn những dữ liệu không hợp lệ trước khi thực hiện xử lý...
Interface: Định nghĩa các đối tượng ( model ) ...
Middleware: Chứa các file xử lí error, validate ...
