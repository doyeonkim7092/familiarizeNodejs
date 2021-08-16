--1.파일이나 대화형 모드의 한 줄과 같이 Lua가 실행하는 각 코드 조각은 청크 입니다. -> 청크는 단순히 일련의 명령문

function norm (x,y)
    local n2 = x^2 + y^2
    return math.sqrt(n2)
end

function twice (x)
    return 2*x
end

print(norm(3.4,1.0))
print(twice(2))

