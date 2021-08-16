-- global
-- 전역 변수는 선언이 필요하지 않습니다. 전역변수에 값을 할당하여 생성하기만 하면됩니다
-- 초기화 되지 않은 변수에 엑세스 해도 오류가 나지 않습니다

b = 10

print(b)

local b = 9

print(b)

-- 로컬로 선언 뒤의 b 는 로컬의 값이 들어았다 let 과 같은 것으로 보인다

local d , f = 5 ,10     --지역 변수로 d=5 f=10 으로 선언
d , f = 5, 10;          --전역 변수로 d=5 f=10 으로 선언 
d, f = 10               --전역 변수로 선언 d = 10 f = nil

--swapping of variables

local a, b

a = 10
b = 30

print('valueof a:',a)
print('valueof b:',b)

b, a = a,b

print('valueof a:',a)
print('valueof b:',b)

f = 70.0/3.0

print('value of f',f)

-- lvalue 메모리 위치를 참조하는 표현식 , 할당의 왼쪽, 오른쪽으로 나타낼 수 있다
-- rvalue 메모리의 일부 주소에 저장된 데이터 값, 할당된 값을 가질 수 없는 표현식, 할당의 오른쪽에 나타날 수 있지만 왼쪽에는 나타낼 수 없다

g = 20
print(g)
-- 10 = 20
-- print(10) -- 오류 
g,l = 20, 30
print(g,l)
