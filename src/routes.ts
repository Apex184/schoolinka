import { UserController } from "./controller/UserController";
import { BlogController } from "./controller/PostController";

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
{
    method: "get",
    route: "/api/post",
    controller: BlogController,
    action: "findAllPosts"
},
{
    method: "get",
    route: "/api/post/:id",
    controller: BlogController,
    action: "getOnePost"
},
{
    method: "post",
    route: "/api/post",
    controller: BlogController,
    action: "createPost"
},
{
    method: "delete",
    route: "/api/post/:id",
    controller: BlogController,
    action: "deletePost"
},
{
    method: "patch",
    route: "/api/post/:id",
    controller: BlogController,
    action: "updatePost"
}
]