package com.quanlydaotao.backend.utils;
import java.text.Normalizer;
import java.util.regex.Pattern;
public class StringUtil {
    public static String removeAccents(String s) {
        if (s == null) return null;
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("").replace("đ", "d").replace("Đ", "D");
    }
    public static String getFirstNameNoAccent(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) return "";
        String[] words = fullName.trim().split("\s+");
        String firstName = words[words.length - 1]; // Vietnamese name standard: last word is first name
        return removeAccents(firstName).toLowerCase();
    }
}
