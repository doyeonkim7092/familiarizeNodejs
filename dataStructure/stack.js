

const Stack = (()=> {
    function Stack(){
        this.top = null;
        this.count = 0;
    }
    function Node(data){
        this.data = data;
        this.next = null;
    }
    Stack.prototype.push = function(data){
        const node = new Node(data);
        node.next = this.top;
        this.top = node;
        this.count++;
        return this.count;
    };
    Stack.prototype.pop = function(){
        if(!this.top){
            let message = 'no data to pop where storage'
            return message;
        }
        const data = this.top.data;
        this.top = this.top.next;
        this.count--;
        return data;
    };
    return Stack
})();

const stack = new Stack();
stack.push('111');
stack.push(['a','b']);
stack.pop();
stack.pop();
console.log(stack,'stack');