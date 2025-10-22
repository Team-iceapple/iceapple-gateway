// api-test
const host = "http://localhost:3000/api";

const pathsToTest = [
  '/home/main',
  '/project/works',
];

const testEndpoint = async (path: string, repetitions: number) => {
  console.log(`[START] ${path} 경로 테스트 시작. (${repetitions}회)`);
  const url = `${host}${path}`;

  const promises = [];

  for (let i = 1; i <= repetitions; i++) {
    const requestPromise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`[FAIL] ${i}번째 요청 실패: Status ${response.status}`);
        }
        return response.text();
      })
      .then(_ => {
        console.log(`[SUCCESS] ${path} - ${i}번째 요청 성공.`);
      })
      .catch(error => {
        console.error(`[ERROR] ${path} - ${i}번째 요청 중 에러 발생:`, error.message);
      });

    promises.push(requestPromise);
  }

  await Promise.all(promises);
  console.log(`[DONE] ${path} 경로 테스트 완료.\n`);
};

const runMemoryLeakTest = async () => {
  console.log('API 테스트');
  console.log('------------------------------------------');

  for (const path of pathsToTest) {
    await testEndpoint(path, 10);
  }

  console.log('------------------------------------------');
  console.log('모든 테스트가 완료되었습니다.');
};

void runMemoryLeakTest();
