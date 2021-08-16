-- type of value

--[[
1. nil - 값이 있거나 없는 데이터와 구별하는데 사용
2. boolean - true / false 상태확인에 사용
3. number - 실수 숫자를 나타냄
4. string - 문자 배열
5. function - c OR lua 로 작성된 메소드
6. userdata - 임의의 c 데이터
7. thread - 독립적인 실행 스레드를 나타내ㅕ, 코루틴?을 구현하는데 사용
8. table - 일반 배열, 테이블, 집합, 레코드, 그래프, 트리 등을 표현하고, 연관 배열을 구현 nil을 제외한 모든 값을 가질 수 있다
--]]

print(type('what is my type'))

t = 10

print((type(5.8*t))) --number
print(type(true)) -- boolean
print(type(print)) -- function
print(type(nil)) -- nil
print(type(type((ABC)))) -- string

