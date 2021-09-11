//single linked-list
// 각 노드가 데이터와 다음 노드를 가리키는 포인터 로 구성된 노드리스트?

class Node {
    constructor(data, next=null) {
        this.data = data;
        this.next = next;
    }
}
class LinkedList{
    constructor() {
        this.head = null;
    }
    insertAtHead = function(data){
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
        return this.head;
    }
    insertAtEnd = function(data){
        const newNode = new Node(data);
        if(!this.head){
            this.head = newNode;
            return this.head;
        }
        let tail = this.head;
        while(tail.next !== null){
            tail = tail.next;
        }
        tail.next = newNode;
        return this.head;
    }
    //해당 위치를 확인..
    getAt = function(index){
        let length = 0;
        let node = this.head;
        // head(==node)가 존재한다면, 인덱스와 카운트가 증가 0부터 함께 증가함. 해당 리스트의 인덱스를 탐색.
        while(node){
            if(length === index){
                return node;
            }
            length++;
            node = node.next;
        }
        return node;
    }
    //원하는 위치에 data를 삽입..
    insertAt = function(data,index){
        //리스트가 비어있는 경우
        if(!this.head){
            this.head = new Node(data);
            this.length++;
            return;
        }
        //맨앞에 넣는 경우 === insertAtHead
        if(index === 0){
            this.head = new Node(data, this.head);
            this.length++;
            return;
        }
        //그렇지 않은 경우 바로 이전 노드를 찾는 함수를 활용 하여, data를 삽입.
        const prev = this.getAt(index-1);
        let newNode = new Node(data);
        newNode.next = prev.next;
        prev.next = newNode;
        this.length++;

        return this.head;
    }
    removeAtHead = function(){
        if(!this.head){
            return;
        }
        this.head = this.head.next;
        return this.head;
    }
    removeAtEnd = function(){
        if(!this.head){
            return null;
        }
        // 1개만있는경우
        if(!this.head.next){
            this.head = null;
            return null;
        }
        let prev = this.head;
        let tail = this.head.next;

        while(tail.next !== null){
            prev = tail;
            tail = tail.next;
        }
        prev.next = null;
        return this.head;
    }
    removeAt = function(index){
        if(!this.head){
            this.head = new Node(data);
            return;
        }
        if(index === 0){
            this.head = this.head.next;
            return;
        }
        const prev = this.getAt(index-1);
        if(!prev || !prev.next){
            return;
        }
        prev.next = prev.next.next

        return this.head;
    }
}
const test = new LinkedList();

test.insertAtHead(1);
test.insertAtEnd(2);
test.insertAt('string',1);
test.removeAtHead();
test.removeAtEnd();
test.removeAt(0);
console.log(test);

sqs