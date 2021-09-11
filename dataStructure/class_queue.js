class Class_queue {
    constructor() {
        this.array = [];
        this.size = 0;

    }
    enque(item){
        this.array.push(item);
        this.size++;
    }
    deque(){
        this.array.shift();
        this.size--;
    }
    size(){
        return this.size;
    }
}

const queue = new Class_queue();

queue.enque(1);
queue.enque([]);
queue.enque('3');
queue.enque(4);
queue.deque();

console.log(queue);