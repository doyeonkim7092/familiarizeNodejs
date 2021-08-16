--반복문

-- while 알고있는 while
--[[
a = 10
while(a<20)
do
    print('value of a:',a)
    a = a+1
end
]]

-- for 알고있는 for
--[[
    for i = 10,1,-1
do
    print(i)
end
]]

-- repeat...until 조건이 충족할때까지 반복문
--[[
a = 10

repeat
    print('value of a:', a)
    a = a + 1
until(a > 15)
]]

-- nested 중첩된 반복문 print로 콘솔찍어서 내용 확인할 수 있다

j = 2
for i = 2,10 do
    for j = 2,(i/j), 2 do
        --print(i/j)
        if(not(i%j))
        then
            break
        end

        if(j > (i/j))then
            --print(i, i/j)
            print('value of i is', i)
        end
    end
end







