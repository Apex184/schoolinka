import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "findAllUsers"
},
{
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "getOneUser"
},
{
    method: "post",
    route: "/users",
    controller: UserController,
    action: "createUser"
},
{
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "deleteUser"
},
{
    method: "patch",
    route: "/users/:id",
    controller: UserController,
    action: "updateUser"
},
{
    method: "get",
    route: "/users/:token/verify",
    controller: UserController,
    action: "verifyUser"
},
]