import { Employee } from "src/interfaces/employee"
import { Reservation } from "src/interfaces/reservation";
import { Shift } from "src/interfaces/shift"

// Define the Model type
interface Model {
    employees: Employee[];
    shifts: Shift[];
    reservations: Reservation[];
    activeEmployeeId: number | null;
    activeShiftId: number | null;
    isAddingEmployee: boolean;
}

// Initial state for the model
const initialState: Model = {
    employees: [],
    shifts: [],
    reservations: [],
    activeEmployeeId: null,
    activeShiftId: null,
    isAddingEmployee: false,
}

// Define the Subscription type
type Subscription = (model: Model) => void;

// List to store all the subscribers
const followers: Subscription[] = [];

// Function to subscribe to the model changes
function subscribe(subscription: Subscription) {
    followers.push(subscription);
}

// Proxy handler to track the state changes
const handler: ProxyHandler<Model> = {
    get(target, prop, receiver) {
        console.log("get called for property:", String(prop));
        return Reflect.get(target, prop, receiver);
    },
    set(model: Model, property: string | symbol, newValue: any, receiver: any) {
        const success = Reflect.set(model, property, newValue, receiver);
        console.log("set called with new value:", String(property), newValue);
        // Notify all subscribers about the model update
        followers.forEach(follower => follower(model));
        return success;
    }
}

// Create a Proxy object for the model
const model = new Proxy(initialState, handler);

// Export the global model, the Model type, and the subscribe function
export { model, Model, subscribe };