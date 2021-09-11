class Class_stack {
    constructor() {
        this.array=[];
        this.size = 0;
    }
    push(item){
        this.array.push(item);
        this.size++;
    }
    pop(){
        this.array.pop();
        this.size--;
    }
    size(){
        return this.array[this.array.length-1];
    }
}

const stack = new Class_stack();

stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();
console.log(stack);