--연산자

a = 10
b = 20

-- 산술

print(a+b)
print(a-b)
print(a*b)
print(a/b)
print(a%b)
print(a^2)
print(-a)

-- 관계

print(a==b) --같은지 
print(a~=b) --같지않은지 자바스크립트에서 != 로 생각하면 되겠다
print(a>b) 
print(a<b)
print(a>=b)
print(a<=b)

-- 논리

c = true
d = false

print(c and d) -- 두 변수(피연산자)가 모두 0이 아니면 true
print(c or d) -- 두 변수(피연산자)가 하나라도 0이 아니면 true
print(not d) -- ! 부정

-- 기타

h = 'hello'
w = 'world'
n = 1

print(h..w..n) -- 변수의 값을 붙여서
print(#h) -- 길이반환

-- 우선순위

-- 산술연산자는 + 보다는 * 먼저 
-- 우선순위가 높은 연산자부터 나열해보자면

--단항 -(음수), #(길이), not(부정)
--연결 ..(연결)
--곱하기 *(곱), /(나누기), %(나머지)
--덧뺄셈 +(더하기), -(빼기)
--관계 <>(크다 작다) <= >=(크거나같고, 작거나 같다), ==(같다), ~=(같지않다)
--동치 ==(같다), ~=(같지않다)
--논리AND and(그리고)
--논리OR or(또는) 