import time

# class Solution:
#     def lengthOfLongestSubstring(self, s: str) -> int:
#         length = 0
#         for i in range(len(s)):
#             substring = s[i]
#             for j in range(i + 1, len(s)):
#                 if substring.__contains__(s[j]):
#                     break
#                 substring += s[j]
#             if len(substring) > length:
#                 length = len(substring)
#         return length
    

# result = Solution().lengthOfLongestSubstring("abcabcbb")
# print(result)


class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        i=0
        j=0
        Map={}
        max_len=0
        while j<len(s):
            if s[j] in Map:
                Map[s[j]]+=1
            else:
                Map[s[j]]=1
            if len(Map)==j-i+1:
                max_len=max(max_len,j-i+1)
            else:
                while len(Map)<j-i+1:
                    Map[s[i]]-=1
                    if Map[s[i]]==0:
                        del Map[s[i]]
                    i+=1
            j+=1
        print(len(Map))
        return max_len




start_time = time.time()
result = Solution().lengthOfLongestSubstring("abcabcbb")
print(result)
print("--- %s seconds ---" % (time.time() - start_time))


# numbers = [1, 1, 2, 3, 4]
# first = set(numbers)
# second = {1, 5}
# print(first | second) # first.union(second, anotherSet)) # union of two sets # all items that are either in the first or the second set
# print(first & second) # intersection of two sets # all items in both sets
# print(first - second) # difference
# print(first ^ second) # symmetric difference # items in either first or second set but not both
# # discard = remove. except discard doesn't throw error if item doesn't exists
# # there's difference and difference_update, and same for other methods, first one take a copy, second update the original set