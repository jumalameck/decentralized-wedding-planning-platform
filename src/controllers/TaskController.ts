import { Err, Ok, text } from "azle/experimental";
import { AddTaskPayload, AddTimelineItemPayload, DeleteTaskPayload, Task, TimelineItem, UpdateTaskStatusPayload, Wedding } from "../datatypes/dataTypes";
import { weddingStorage } from "../storage/storage";
import { v4 as uuidv4 } from "uuid";


class TaskController {
    static addTimelineItem = (payload: AddTimelineItemPayload) => {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        const timelineItem: TimelineItem = {
            ...payload,
            status: "pending",
        };

        const updatedWedding = {
            ...wedding,
            timeline: [...wedding.timeline, timelineItem],
        };

        weddingStorage.insert(payload.weddingId, updatedWedding);

        return Ok({
            message: "Timeline item added successfully",
            wedding: updatedWedding,
        });
    }

    static addTask = (payload: AddTaskPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const newTask: Task = {
                id: uuidv4(),
                title: payload.title,
                description: payload.description,
                deadline: payload.deadline,
                assignedTo: payload.assignedTo,
                status: "pending",
                budget: payload.budget,
            };

            const updatedWedding: Wedding = {
                ...wedding,
                tasks: [...wedding.tasks, newTask],
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Task added successfully",
                wedding: updatedWedding,
                newTask,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Failed to add task: ${error}` });
        }
    }

    static updateTaskStatus = (payload: UpdateTaskStatusPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const taskIndex = wedding.tasks.findIndex(
                (task) => task.id === payload.taskId
            );
            if (taskIndex === -1) {
                return Err({ UnauthorizedAction: "Task not found" });
            }

            const updatedTask: Task = {
                ...wedding.tasks[taskIndex],
                status: payload.status,
            };

            const updatedWedding: Wedding = {
                ...wedding,
                tasks: [
                    ...wedding.tasks.slice(0, taskIndex),
                    updatedTask,
                    ...wedding.tasks.slice(taskIndex + 1),
                ],
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Task status updated successfully",
                wedding: updatedWedding,
                updatedTask,
            });
        } catch (error) {
            return Err({
                UnauthorizedAction: `Failed to update task status: ${error}`,
            });
        }
    }

    static deleteTask = (payload: DeleteTaskPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const updatedTasks = wedding.tasks.filter(
                (task) => task.id !== payload.taskId
            );
            if (updatedTasks.length === wedding.tasks.length) {
                return Err({ UnauthorizedAction: "Task not found" });
            }

            const updatedWedding: Wedding = {
                ...wedding,
                tasks: updatedTasks,
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Task deleted successfully",
                wedding: updatedWedding,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Failed to delete task: ${error}` });
        }
    }

    static getTaskList = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }
        return Ok(wedding.tasks);
    }

    static getTaskDetails=(weddingId:text, taskId:text)=>{
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }
  
        const task = wedding.tasks.find((task) => task.id === taskId);
        if (!task) {
          return Err({ UnauthorizedAction: "Task not found" });
        }
  
        return Ok(task);
    }

}

export default TaskController