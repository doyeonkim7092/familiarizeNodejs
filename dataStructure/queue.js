/*
화살표 함수로 메소드, prototype, 생성자함수로 사용하는 것은 피해야 한다.
최상위 윈도우의 this를 참조한다.
* */

const Queue = (() => {
    function Queue(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }
    function Node(data){
        this.data = data;
        this.next = null;
    }
    Queue.prototype.enqueue = function(data)  {
        const node = new Node(data);
        if(!this.head){
            this.head = node;
        }
        else{
            this.tail.next = node;
        }
        this.tail = node;
        this.length++;
        return this.length;
    }
    Queue.prototype.dequeue = function()  {
        if(!this.head){
            let message = 'no data to dequeue where storage'
            return message;
        }
        const data = this.head.data;
        this.head = this.head.next;
        this.length--;
        return data;
    }
    return Queue;
})();

let queue= new Queue();

queue.enqueue(1);
queue.enqueue('string');
queue.dequeue();
queue.dequeue();

console.log(queue,'queue');

