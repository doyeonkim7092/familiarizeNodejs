--함수

function max(x,y)
    if(x>y) then
        result = x;
    else
        result = y;
    end
    return result
end

print(max(2,3))

--루아에서는 함수를 변수에 할당할 수 있고 다른 함수의 매개변수로 전달할 수도 있습니다.

myresult = function(a)
    print('this is my print function - ##',a,'##')
end

function add(x,y,functionresult)
    result = x + y
    functionresult(result)
end

myresult(10)
add(2,5,myresult)


function average(...)
    result = 0
    local arg = {...}
    for i,v in ipairs(arg) do
        result = result + v
    end
    return result/#arg
end

print('the average is',average(10,5,3,4,5,6))