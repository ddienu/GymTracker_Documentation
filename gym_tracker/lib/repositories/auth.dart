import 'package:gym_tracker/models/login_dto.dart';
import 'package:gym_tracker/services/auth_service.dart';

class AuthRepository{
  final AuthService _authService;

  const AuthRepository(this._authService);

  Future<String> login(String username, String password){
    final dto = LoginDto(username: username, password: password);
    return _authService.login(dto);
  }
}