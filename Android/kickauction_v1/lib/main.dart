import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';



void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyAppWebView());
}

class MyAppWebView extends StatefulWidget {
  const MyAppWebView({super.key});

  @override
  State<MyAppWebView> createState() => _MyAppWebViewState();
}

class _MyAppWebViewState extends State<MyAppWebView> {
  late final WebViewController controller; // WebViewController 선언

  @override
  void initState() {
    super.initState();

    // WebViewController 초기화
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted) // JavascriptMode는 여기서 설정
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            // 웹 페이지 로딩 진행 상황을 추적할 때 사용 (선택 사항)
            debugPrint('WebView is loading (progress: $progress%).');
          },
          onPageStarted: (String url) {
            // 웹 페이지 로딩 시작 시 호출 (선택 사항)
            debugPrint('Page started loading: $url');
          },
          onPageFinished: (String url) {
            // 웹 페이지 로딩 완료 시 호출 (선택 사항)
            debugPrint('Page finished loading: $url');
          },
          onWebResourceError: (WebResourceError error) {
            // 웹 리소스 오류 발생 시 호출 (선택 사항)
            debugPrint('''
              Page resource error:
                code: ${error.errorCode}
                description: ${error.description}
                errorType: ${error.errorType}
                isForMainFrame: ${error.isForMainFrame}
            ''');
          },
          onNavigationRequest: (NavigationRequest request) {
            // 특정 URL로 이동을 제어할 때 사용 (선택 사항)
            if (request.url.startsWith('https://www.youtube.com/')) {
              debugPrint('blocking navigation to ${request.url}');
              return NavigationDecision.prevent; // 특정 URL로의 이동 차단
            }
            debugPrint('allowing navigation to ${request.url}');
            return NavigationDecision.navigate;
          },
          onUrlChange: (UrlChange change) {
            // URL 변경 시 호출
            debugPrint('url changed to ${change.url}');
          },
        ),
      )
      ..addJavaScriptChannel( // JavaScript 채널 추가 (웹과 Flutter 간 통신)
        'Toaster', // 웹에서 window.Toaster.postMessage('hello'); 호출 가능
        onMessageReceived: (JavaScriptMessage message) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(message.message)),
          );
        },
      )
    // 로드할 초기 URL 개발IP 192.168.219.72 / AWS IP 3.37.151.29
      ..loadRequest(Uri.parse('http://192.168.219.247:3000'));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('KickAuction Web')),
        body: WebViewWidget(controller: controller), // 초기화된 컨트롤러를 WebViewWidget에 전달
      ),
    );
  }
}




