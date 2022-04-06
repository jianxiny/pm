from flask import Flask, json, request
import time

app = Flask(__name__)

# user
#
admin = {"id": 1, "name": "admin", "password": "admin123"}
users = [admin]

global idcn
idcn = 2


def get_staff(name, pwd):
    for u in users:
        if u.get("name") == name and u.get("password") == pwd:
            return u
    return None


def get_stax_by_token(token: str):
    id = token.split("-")[0]

    for u in users:
        if u.get("id") == int(id):
            return u
    return None


def generatge_payload(user):
    payload = {
        "user": {
            "id": user["id"],
            "name": user["name"],
            "token": f"{user['id']}-{user['name']}",
        },
    }
    return payload


@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return "", 400
    name = data.get("username", "")
    pwd = data.get("password", "")
    print(name, pwd)

    u = get_staff(name, pwd)
    if u is None:
        return "", 400

    return json.dumps(generatge_payload(u)), 200


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return "", 400
    name = data.get("username", "")
    pwd = data.get("password", "")
    print(name, pwd)

    if get_staff(name, pwd) is not None:
        return "", 400

    global idcn
    user = {"name": name, "password": pwd, "id": idcn}
    idcn += 1
    users.append(user)

    payload = {
        "user": {
            "id": user["id"],
            "name": user["name"],
            "token": f"{user['id']}-{user['name']}",
        },
    }
    return json.dumps(payload), 201


@app.route("/api/users")
def get_users():
    return json.dumps(users), 200


@app.route("/api/me", methods=["GET"])
def me():
    token = request.headers.get("x-auth")
    u = get_stax_by_token(token)
    if u is None:
        return "", 401
    payload = {
        "user": {
            "id": u["id"],
            "name": u["name"],
            "token": f"{u['id']}-{u['name']}",
        },
    }
    return json.dumps(payload), 200


# projects

projects = [
    {
        "personId": 1,
        "organization": "快递组",
        "created": 1604989757139,
        "ownerId": 1,
        "name": "快递管理",
        "id": 1,
    },
    {
        "organization": "test dept",
        "personId": 1,
        "ownerId": 1,
        "created": 1649162364831,
        "id": 3,
        "name": "djano-project",
    },
]


def get_project_by(id):
    for p in projects:
        if id == p["id"]:
            return p
    return None


def filter_project_with_property(pp, value, source=projects):

    r_projects = []
    for k in source:
        if k[pp] == value:
            r_projects.append(k)

    return r_projects


def update_project_with(id, name, organization, personId):

    project = get_project_by(int(id))
    if not project:
        return project
    project["name"] = name or project["name"]
    project["organization"] = organization or project["organization"]
    project["personId"] = personId or project["personId"]
    return project


def pop_project_by(id):

    project = None
    pop_index = -1
    for i, k in enumerate(projects):
        if k["id"] == int(id):

            pop_index = i

    if pop_index < 0:
        return None
    project = projects.pop(pop_index)

    return project


@app.route("/api/projects/<int:id>", methods=["GET", "PATCH", "DELETE"])
def get_project_by_id(id):
    if request.method == "GET":
        p = get_project_by(id)
        return json.dumps(p), 200
    if request.method == "PATCH":
        data = request.get_json()
        if not data:
            return json.dumps({}), 400
        name = data.get("name", "")
        organization = data.get("organization", "")
        personId = data.get("personId", "")
        project = update_project_with(id, name, organization, personId)
        if project is None:
            return json.dumps({}), 400
        return json.dumps(project), 200
    if request.method == "DELETE":
        project = pop_project_by(id)
        return json.dumps(project), 200


@app.route("/api/projects", methods=["GET", "POST", "DELETE"])
def get_projects():

    if request.method == "GET":
        r_projects = projects 
        filter_array = []
        id = int(request.args.get("personId", 0))
        if id:
            filter_array.append({"p": "personId", "k": id})

        name = request.args.get("name", 0)
        if name:
            filter_array.append({"p": "name", "k": name})

        for f in filter_array:
            r_projects = filter_project_with_property(f["p"], f["k"], r_projects)


        return json.dumps(r_projects), 200
    if request.method == "POST":

        data = request.get_json()
        if not data:
            return json.dumps({}), 400
        name = data.get("name", "")
        organization = data.get("organization", "")
        person_id = data.get("personId", "")
        project = {
            "organization": organization,
            "personId": person_id or 1,
            "ownerId": 1,
            "created": int(time.time()),
            "id": 3,
            "name": name,
        }
        projects.append(project)
        return json.dumps(projects), 201


# task

task_type = [
    {"ownerId": 1, "name": "task", "id": 1},
    {"ownerId": 1, "name": "bug", "id": 2},
]

tasks = [
    {
        "tags": [2],
        "reporterId": 2,
        "processorId": 3,
        "kanbanId": 3,
        "favorite": True,
        "typeId": 1,
        "note": "请尽快完成",
        "ownerId": 1,
        "name": "管理注册界面开发",
        "id": 1,
        "projectId": 1,
    },
    {
        "tags": [1],
        "reporterId": 4,
        "processorId": 4,
        "kanbanId": 3,
        "favorite": True,
        "typeId": 1,
        "note": "请使用JWT完成",
        "ownerId": 1,
        "name": "管理登录界面开发",
        "id": 2,
        "projectId": 1,
    },
    {
        "tags": [2],
        "reporterId": 3,
        "processorId": 1,
        "kanbanId": 1,
        "favorite": True,
        "typeId": 2,
        "note": "",
        "ownerId": 1,
        "name": "单元测试",
        "id": 3,
        "projectId": 1,
    },
    {
        "tags": [3],
        "reporterId": 2,
        "processorId": 4,
        "kanbanId": 1,
        "favorite": True,
        "typeId": 1,
        "note": "",
        "ownerId": 1,
        "name": "性能优化",
        "id": 4,
        "projectId": 1,
    },
    {
        "tags": [2],
        "reporterId": 4,
        "processorId": 4,
        "kanbanId": 2,
        "favorite": True,
        "typeId": 2,
        "note": "",
        "ownerId": 1,
        "name": "权限管理界面开发",
        "id": 5,
        "projectId": 1,
    },
    {
        "tags": [2],
        "reporterId": 2,
        "processorId": 1,
        "kanbanId": 3,
        "favorite": True,
        "typeId": 2,
        "note": "",
        "ownerId": 1,
        "name": "UI开发",
        "id": 6,
        "projectId": 1,
    },
    {
        "tags": [2],
        "reporterId": 1,
        "processorId": 2,
        "kanbanId": 3,
        "favorite": True,
        "typeId": 2,
        "note": "",
        "ownerId": 1,
        "name": "自测",
        "id": 7,
        "projectId": 1,
    },
]


def filter_task_with_property(pp, value, source):

    r_tasks = []
    for k in source:
        if k[pp] == value:
            r_tasks.append(k)

    return r_tasks


def filter_task_with_processor(id):

    r_tasks = []
    for k in tasks:
        if k["processorId"] == id:
            r_tasks.append(k)

    return r_tasks


def filter_task_with_type(type):

    r_tasks = []
    for k in tasks:
        if k["typeId"] == int(type):
            r_tasks.append(k)

    return r_tasks


def pop_task_by(id):
    task = None
    pop_index = -1
    for i, k in enumerate(tasks):
        if k["id"] == int(id):

            pop_index = i

    if pop_index < 0:
        return None
    task = tasks.pop(pop_index)

    return task


def get_tasks_by(id):
    r_tasks = []
    for k in tasks:
        if k["projectId"] == id:
            r_tasks.append(k)

    return r_tasks


def get_task_by(id):
    task = None
    for k in tasks:
        if k["id"] == int(id):
            task = k
    return task


def update_task_with(id, name, type_id, processor, kb_id=None):
    task = get_task_by(int(id))
    if not task:
        return task
    task["name"] = name or task["name"]
    task["typeId"] = type_id or task["typeId"]
    task["kanbanId"] = kb_id or task["kanbanId"]
    task["processorId"] = processor or task["processorId"]
    return task


@app.route("/api/taskTypes")
def get_task_types():
    return json.dumps(task_type)


def move_task(fr, ref, op):
    fr_index = 0
    ref_index = 0

    for i, v in enumerate(tasks):
        if v["id"] == int(fr):
            fr_index = i

            if not ref:
                task = tasks.pop(fr_index)
                print("pop task", task)
                tasks.append(task)
                return

        if ref and v["id"] == int(ref):
            ref_index = i

    fr_item = tasks[fr_index]
    if op == "before":
        if fr_index < ref_index:
            return
        else:
            fr_item = tasks.pop(fr_index)
            tasks.insert(ref_index, fr_item)

    if op == "after":

        if fr_index < ref_index:
            tasks.insert(ref_index + 1, fr_item)
            fr_item = tasks.pop(fr_index)
        if fr_index > ref_index:
            return


def order_task_with(fr_id, ref_id, fr_kb_id, rf_kb_id, op):
    print("upid", fr_id)
    # update from kb id and order
    task = update_task_with(fr_id, "", "", "", rf_kb_id)
    move_task(fr_id, ref_id, op)
    return task


@app.route("/api/tasks/reorder", methods=["POST"])
def reorder():

    data = request.get_json()
    if not data:
        return json.dumps({}), 400
    from_id = data.get("fromId", "")
    ref_id = data.get("referenceId", "")
    fr_kanban_id = data.get("fromKanbanId", "")
    rf_kanban_id = data.get("toKanbanId", "")
    op = data.get("type", "")
    order_task_with(from_id, ref_id, fr_kanban_id, rf_kanban_id, op)
    return json.dumps(tasks), 200


@app.route("/api/tasks", methods=["POST", "GET"])
def get_tasks_with_project():
    if request.method == "GET":

        r_tasks = tasks 
        filter_array = []
        id = int(request.args.get("projectId", 0))
        if id:
            filter_array.append({"p": "projectId", "k": id})

        name = request.args.get("name", 0)
        if name:
            filter_array.append({"p": "name", "k": name})
        pid = int(request.args.get("processorId", 0))
        if pid:
            filter_array.append({"p": "processorId", "k": pid})

        tid = int(request.args.get("typeId", 0))
        if tid:
            filter_array.append({"p": "typeId", "k": tid})

        for f in filter_array:
            r_tasks= filter_task_with_property(f["p"], f["k"], r_tasks)

        return json.dumps(r_tasks), 200
    if request.method == "POST":

        data = request.get_json()
        if not data:
            return json.dumps({}), 400
        name = data.get("name", "")
        kanban_id = data.get("kanbanId", "")
        project_id = data.get("projectId", "")
        task = {
            "tags": [2],
            "processorId": project_id,
            "kanbanId": kanban_id,
            "favorite": True,
            "typeId": 2,
            "ownerId": 1,
            "name": name,
            "id": len(tasks) + 1,
            "projectId": project_id,
        }
        tasks.append(task)
        return json.dumps(tasks), 201


@app.route("/api/tasks/<int:id>", methods=["GET", "PATCH", "DELETE"])
def op_task_with(id):
    if request.method == "GET":
        task = get_task_by(id)
        return json.dumps(task), 200

    if request.method == "PATCH":
        data = request.get_json()
        if not data:
            return json.dumps({}), 400
        name = data.get("name", "")
        type_id = data.get("typeId", "")
        processor = data.get("processorId", "")
        task = update_task_with(id, name, type_id, processor)
        if task is None:
            return json.dumps({}), 400
        return json.dumps(task), 200
    if request.method == "DELETE":
        task = pop_task_by(id)
        return json.dumps(task), 200


# kanban
kanbans = [
    {"ownerId": 1, "name": "待完成", "id": 1, "projectId": 1},
    {"ownerId": 1, "name": "开发中", "id": 2, "projectId": 1},
    {"ownerId": 1, "name": "已完成", "id": 3, "projectId": 1},
]


def move_kanban(fr, ref, op):
    fr_index = 0
    ref_index = 0

    for i, v in enumerate(kanbans):
        if v["id"] == int(fr):
            fr_index = i
        if v["id"] == int(ref):
            ref_index = i
    fr_item = kanbans[fr_index]
    ref_item = kanbans[ref_index]
    if op == "before":
        fr_item = kanbans.pop(fr_index)
        kanbans.insert(ref_index, fr_item)
    if op == "after":
        kanbans.insert(ref_index + 1, fr_item)
        kanbans.pop(fr_index)


def get_kanbans_by(id):
    r_kanbans = []
    for k in kanbans:
        if k["ownerId"] == id:
            r_kanbans.append(k)

    return r_kanbans


@app.route("/api/kanbans")
def get_kanbans():
    id = int(request.args.get("projectId", 0))
    r_kanbans = get_kanbans_by(id)
    return json.dumps(r_kanbans), 200


@app.route("/api/kanbans/reorder", methods=["POST"])
def kanban_reorder():
    data = request.get_json()
    if not data:
        return "", 400

    from_id = data.get("fromId", "")
    ref_id = data.get("referenceId", "")
    o_type = data.get("type", "")

    if not from_id or not ref_id or not o_type:
        return "", 400

    move_kanban(int(from_id), int(ref_id), o_type)
    return json.dumps({}), 200
