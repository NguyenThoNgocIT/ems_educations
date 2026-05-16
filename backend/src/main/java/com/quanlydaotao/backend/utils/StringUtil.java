package com.quanlydaotao.backend.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class StringUtil {
    private static final Pattern DIACRITICAL_MARKS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]");

    private StringUtil() {
    }

    public static String removeAccents(String value) {
        if (value == null) {
            return null;
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return DIACRITICAL_MARKS.matcher(normalized)
                .replaceAll("")
                .replace("đ", "d")
                .replace("Đ", "D");
    }

    public static String normalizeForAccountCode(String value) {
        String noAccent = removeAccents(value);
        if (noAccent == null) {
            return "";
        }
        return NON_ALPHANUMERIC.matcher(noAccent.toLowerCase(Locale.ROOT)).replaceAll("");
    }

    public static String getFirstNameNoAccent(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] words = fullName.trim().split("\\s+");
        return normalizeForAccountCode(words[words.length - 1]);
    }
}
